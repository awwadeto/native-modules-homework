package com.mobile

import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class CustomButtonViewManager : SimpleViewManager<CustomButton>() {
  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(reactContext: ThemedReactContext): CustomButton {
    return CustomButton(reactContext)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
    return MapBuilder.builder<String, Any>()
        .put(
            CustomButton.EVENT_ON_PRESS,
            MapBuilder.of(
                "phasedRegistrationNames", MapBuilder.of("bubbled", CustomButton.EVENT_ON_PRESS)))
        .build()
  }

  @ReactProp(name = "title")
  fun setTitle(view: CustomButton, title: String?) {
    view.text = title ?: ""
  }

  @ReactProp(name = "disabled", defaultBoolean = false)
  fun setDisabled(view: CustomButton, disabled: Boolean) {
    view.disabled = disabled
  }

  companion object {
    private const val REACT_CLASS = "CustomButton"
  }
}
