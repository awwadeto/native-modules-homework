import UIKit
import React

@objc(RNCustomButton)
final class RNCustomButton: UIButton {
  @objc var onPress: RCTBubblingEventBlock?

  @objc var title: String = "" {
    didSet {
      setTitle(title, for: .normal)
    }
  }

  @objc var disabled: Bool = false {
    didSet {
      isEnabled = !disabled
      alpha = disabled ? 0.5 : 1.0
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setup()
  }

  private func setup() {
    addTarget(self, action: #selector(handlePress), for: .touchUpInside)
  }

  @objc
  private func handlePress() {
    guard !disabled else { return }
    onPress?([:])
  }
}
