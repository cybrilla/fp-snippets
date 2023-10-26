package com.cybrilla.upidemo;

public enum UpiApp {
    PAYTM("net.one97.paytm"),
    GOOGLE_PAY("com.google.android.apps.nbu.paisa.user"),
    PHONE_PE("com.phonepe.app"),
    All_UPI_APPS("");

    private final String packageName;

    public String getPackageName() {
        return packageName;
    }

    UpiApp(String packageName) {
        this.packageName = packageName;
    }
}
