package com.redimed.telehealth.patient.network;

import android.annotation.TargetApi;
import android.os.Build;
import android.support.annotation.NonNull;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;


/**
 * Created by MeditekPro on 7/14/16.
 */
public class WEBClient extends WebViewClient {

    private static final String TAG = "=====WEB_CLIENT=====";

    @SuppressWarnings("deprecation")
    @Override
    public WebResourceResponse shouldInterceptRequest(@NonNull WebView view, @NonNull String url) {
        if (urlShouldBeHandledByWebView(url)) {
            return super.shouldInterceptRequest(view, url);
        }
        return handleRequestViaOkHttp(url);
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public WebResourceResponse shouldInterceptRequest(@NonNull WebView view, @NonNull WebResourceRequest request) {
        String url = request.getUrl().toString();
        if (urlShouldBeHandledByWebView(url)) {
            return super.shouldInterceptRequest(view, request);
        }
        return handleRequestViaOkHttp(url);
    }

    static boolean urlShouldBeHandledByWebView(@NonNull String url) {
        // file: Resolve requests to local files such as files from cache folder via WebView itself
        return url.startsWith("https:");
    }

    @NonNull
    private WebResourceResponse handleRequestViaOkHttp(@NonNull String url) {
        Log.d(TAG, url);
        try {
            Request request = new Request.Builder().url(url).build();

            OkHttpClient okHttpClient = new OkHttpClient();
            okHttpClient.interceptors().add(new RESTClient.RequestInterceptor());

            Call call = okHttpClient.newCall(request);
            Response response = call.execute();

            return new WebResourceResponse("text/html", "UTF-8", response.body().byteStream());
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
            return null;
        }
    }
}
