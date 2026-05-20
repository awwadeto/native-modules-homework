import UIKit
import React

@objc(RNCustomButtonViewManager)
final class RNCustomButtonViewManager: RCTViewManager {
  override func view() -> UIView! {
    RNCustomButton()
  }

  override static func requiresMainQueueSetup() -> Bool {
    true
  }
}
