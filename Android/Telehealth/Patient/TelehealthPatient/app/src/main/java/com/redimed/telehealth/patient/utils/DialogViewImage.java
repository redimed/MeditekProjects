package com.redimed.telehealth.patient.utils;

import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.PointF;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.FloatMath;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.squareup.picasso.Callback;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;
import com.squareup.picasso.UrlConnectionDownloader;

import java.io.IOException;
import java.net.HttpURLConnection;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by LamNguyen on 12/17/2015.
 */
public class DialogViewImage extends Dialog implements View.OnClickListener{

    private int rotation, index = 0;
    private String imgUrl;
    private Context context;
    private Bitmap imgBitmap;
    private SharedPreferences telehealthPatient;
    private static final ImageView.ScaleType[] scaleTypes = {ImageView.ScaleType.CENTER, ImageView.ScaleType.CENTER_CROP, ImageView.ScaleType.CENTER_INSIDE, ImageView.ScaleType.FIT_XY, ImageView.ScaleType.FIT_CENTER};

    // these matrices will be used to move and zoom image
    private Matrix matrix = new Matrix();
    private Matrix savedMatrix = new Matrix();

    // we can be in one of these 3 states
    private int mode = NONE;
    private static final int NONE = 0;
    private static final int DRAG = 1;
    private static final int ZOOM = 2;

    // remember some things for zooming
    private float d = 0f;
    private float newRot = 0f;
    private float oldDist = 1f;
    private float[] lastEvent = null;
    private PointF mid = new PointF();
    private PointF start = new PointF();

    @Bind(R.id.imgView)
    TouchImageView imgView;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;
    @Bind(R.id.btnClose)
    Button btnClose;
    @Bind(R.id.btnRotate)
    Button btnRotate;
    @Bind(R.id.txtAlert)
    TextView txtAlert;

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
        DisplayImage();

        btnClose.setOnClickListener(this);
        btnRotate.setOnClickListener(this);
    }

    private void DisplayImage() {
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
                        txtAlert.setVisibility(View.VISIBLE);
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.load(imgUrl)
                .error(R.drawable.icon_error_image)
                .into(new Target() {
                    @Override
                    public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                        progressBar.setVisibility(View.GONE);
                        btnClose.setVisibility(View.VISIBLE);

                        imgView.setImageBitmap(bitmap);
                        ImageView.ScaleType currentScaleType = ImageView.ScaleType.FIT_XY;
                        imgView.setScaleType(currentScaleType);
                    }

                    @Override
                    public void onBitmapFailed(Drawable errorDrawable) {
                        progressBar.setVisibility(View.GONE);
                        txtAlert.setVisibility(View.VISIBLE);
                    }

                    @Override
                    public void onPrepareLoad(Drawable placeHolderDrawable) {}
                });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnClose:
                dismiss();
                break;
            case R.id.btnRotate:
                rotation += 90;
                rotation %= 360;
                break;
        }
    }
}

