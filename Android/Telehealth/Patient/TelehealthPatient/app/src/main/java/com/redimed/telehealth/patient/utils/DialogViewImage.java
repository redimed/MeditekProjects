package com.redimed.telehealth.patient.utils;

import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.redimed.telehealth.patient.R;
import com.squareup.picasso.Callback;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.UrlConnectionDownloader;

import java.io.IOException;
import java.net.HttpURLConnection;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by LamNguyen on 12/17/2015.
 */
public class DialogViewImage extends Dialog {

    private Context context;
    private String imgUrl;
    private SharedPreferences telehealthPatient;

    @Bind(R.id.imgView)
    ImageView imgView;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;
    @Bind(R.id.btnClose)
    Button btnClose;

    public DialogViewImage(Context ctx, String url) {
        super(ctx);
        this.context = ctx;
        this.imgUrl = url;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.custom_view_image_dialog);
        ButterKnife.bind(this);

        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        progressBar.setVisibility(View.VISIBLE);
        telehealthPatient = context.getSharedPreferences("TelehealthUser", context.MODE_PRIVATE);
        Picasso picasso = new Picasso.Builder(context)
                .downloader(new UrlConnectionDownloader(context) {
                    @Override
                    protected HttpURLConnection openConnection(Uri uri) throws IOException {
                        HttpURLConnection connection = super.openConnection(uri);
                        connection.addRequestProperty("Authorization", "Bearer " + telehealthPatient.getString("token", null));
                        connection.addRequestProperty("DeviceID", telehealthPatient.getString("deviceID", null));
                        connection.addRequestProperty("SystemType", "ARD");
                        connection.addRequestProperty("Cookie", telehealthPatient.getString("cookie", null));
                        connection.addRequestProperty("AppID", "com.redimed.telehealth.patient");
                        return connection;
                    }
                })
                .listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        progressBar.setVisibility(View.GONE);
                        btnClose.setVisibility(View.VISIBLE);
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.load(imgUrl)
                .memoryPolicy(MemoryPolicy.NO_CACHE)
                .networkPolicy(NetworkPolicy.NO_CACHE)
                .error(R.drawable.icon_error_image)
                .fit().into(imgView, new Callback() {
            @Override
            public void onSuccess() {
                if (progressBar != null) {
                    progressBar.setVisibility(View.GONE);
                    btnClose.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onError() {
                if (progressBar != null) {
                    progressBar.setVisibility(View.GONE);
                    btnClose.setVisibility(View.VISIBLE);
                }
            }
        });
    }
}
