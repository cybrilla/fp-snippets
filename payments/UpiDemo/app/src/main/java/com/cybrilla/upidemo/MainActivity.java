package com.cybrilla.upidemo;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView upiView = findViewById(R.id.upi_view);
        upiView.setScrollContainer(true);
        upiView.setScrollbarFadingEnabled(true);
        new UpiPaymentProvider(upiView, this).init();

        //provide payment url here
        String paymentUrl = "<payment-url>";
        upiView.loadUrl(paymentUrl);


        upiView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                String upiAppProtocol = url.split(":")[0];
                // Check if the URL starts with "https" or "http"
                if (url.startsWith("https://") || url.startsWith("http://")) {
                    return super.shouldOverrideUrlLoading(view,url);
                }
                try {
                    Intent newIntent = new Intent(Intent.ACTION_VIEW);
                    newIntent.setData(Uri.parse(url));
                    startActivity(newIntent);
                    Toast.makeText(getApplicationContext(), "Successfully opened "+upiAppProtocol + " app", Toast.LENGTH_SHORT).show();
                    return true;
                } catch (ActivityNotFoundException ex) {
                    //If can not open the UPI application error comes here
                    Toast.makeText(getApplicationContext(), "Can not open " + upiAppProtocol + " app", Toast.LENGTH_SHORT).show();
                    return true;
                }
            }
        });
    }
}