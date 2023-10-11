package com.cybrilla.upidemo;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;
import java.util.Objects;

public class UpiPaymentProvider {
    private final WebView webView;
    private final Activity activity;
    private static final String UPI_URL_SCHEMA = "upi://pay";

    public UpiPaymentProvider(WebView webView, Activity activity) {
        this.webView = webView;
        this.activity = activity;
    }

    /**
     * Setting the bridge between android and HTML page, don't change the bridge (android) name
     */
    @SuppressLint("SetJavaScriptEnabled")
    public void init() {
        this.webView.addJavascriptInterface(this, "android");
        if (Build.VERSION.SDK_INT >= 19) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        webView.getSettings().setJavaScriptEnabled(true);
    }

    /**
     * This method will get called from HTML page, don't change the method name
     */
    @JavascriptInterface
    public void getUpiData() {
        this.activity.runOnUiThread(new Runnable() {
            public void run() {
                try {
                    JSONObject jsonObject = new JSONObject();
                    JSONArray supportedUpiApps = getDefaultSupportedUpiApps(UpiPaymentProvider.this.activity);
                    jsonObject.put("upiApps", supportedUpiApps);
                    UpiPaymentProvider.this.webView.loadUrl(String.format("javascript: onLoadUpiApps(%s)", jsonObject));
                } catch (Exception exception) {
                    exception.printStackTrace();
                }
            }
        });
    }


    private static JSONArray getDefaultSupportedUpiApps(Context context) {
        JSONArray finalAppList = new JSONArray();
        for (UpiApp upiApp : UpiApp.values()) {
            String packageName = upiApp.getPackageName();
            if (isAppInstalled(context, packageName) && isAppUpiReady(context, packageName)) {
                finalAppList.put(upiApp);
            }
        }
        return finalAppList;
    }


    /**
     * This method check if requested application is installed on the device or not
     * @param context
     * @param packageName
     * @return
     */
    public static boolean isAppInstalled(Context context, String packageName) {
        PackageManager packageManager = context.getPackageManager();
        try {
            packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException ignored) {
        }
        return false;
    }

    /**
     * Checks if application is ready to accept upi payments or not
     * @param context
     * @param packageName
     * @return
     */
    public static boolean isAppUpiReady(Context context, String packageName) {
        Intent upiIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(UPI_URL_SCHEMA));
        PackageManager pm = context.getPackageManager();
        List<ResolveInfo> upiActivities = pm.queryIntentActivities(upiIntent, 0);

        for (ResolveInfo a : upiActivities) {
            if (Objects.equals(a.activityInfo.packageName, packageName)) {
                return true;
            }
        }
        return false;
    }
}
