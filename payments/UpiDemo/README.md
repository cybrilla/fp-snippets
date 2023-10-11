# Android UPI Intent Demo

This Android application serves as a demo for rendering a FP payment checkout page within an Android app.

## Getting Started

To begin using this demo app, follow these steps:

1. Pass the FP payment link to the `paymentUrl` variable within the `onCreate()` method of the `MainActivity` class.

## Implementation

Here's a brief overview of the key components and steps involved in the implementation:

1. **UpiPaymentProvider Class**

   The `UpiPaymentProvider` class plays a crucial role in this application. The `init()` method is called when the webview loads to establish a bridge between the Android app and the payment HTML page.

2. **Getting UPI Apps**

   After the payment page is loaded, the `getUpiData` method is called to list the supported UPI apps available on the payment checkout page.

3. **Rendering Supported UPI Apps**

   The `onLoadUpiApps()` method on the payment page ensures that only supported UPI apps are rendered

4. **Fetching Supported UPI Apps**

   The `getDefaultSupportedUpiApps` method retrieves a list of whitelisted UPI apps that are ready for making payments.

5. **Making UPI Payments**

   When a UPI URI is triggered from the payment page, the `shouldOverrideUrlLoading()` method is invoked, which, in turn, initiates a new Intent and opens the UPI app for payment processing.

Please refer to the code and comments within the application for a more detailed understanding of how the implementation works.