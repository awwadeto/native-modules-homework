import Foundation
import UIKit
import UserNotifications

@objc(Notification)
final class Notification: NSObject {
  private let center = UNUserNotificationCenter.current()

  static func moduleName() -> String {
    "Notification"
  }

  @objc
  func requestPermissions() {
    center.getNotificationSettings { _ in
      self.center.requestAuthorization(options: [.alert, .sound, .badge]) { _, error in
        self.handleAuthorizationResult(error: error)
      }
    }
  }

  @objc
  func showNotification(_ title: String, location body: String) {
    let content = makeContent(title: title, body: body)
    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 3, repeats: false)
    let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)

    DispatchQueue.main.async {
      self.schedule(request)
    }
  }

  static func requiresMainQueueSetup() -> Bool {
    true
  }

  private func makeContent(title: String, body: String) -> UNMutableNotificationContent {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.sound = .default
    content.userInfo = ["foreground": true]
    return content
  }

  private func schedule(_ request: UNNotificationRequest) {
    center.add(request) { error in
      if let error {
        print("Error adding notification request: \(error.localizedDescription)")
        return
      }

      print("Notification request added successfully")
      self.center.delegate = self
    }
  }

  private func handleAuthorizationResult(error: Error?) {
    if let error {
      print("Error requesting notification permissions: \(error.localizedDescription)")
    }

    center.getNotificationSettings { settings in
      print("New notification settings: \(settings.authorizationStatus.rawValue)")
    }
  }
}

extension Notification: UNUserNotificationCenterDelegate {
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    print("Will present notification in foreground")
    completionHandler([.banner, .sound, .badge])
  }
}