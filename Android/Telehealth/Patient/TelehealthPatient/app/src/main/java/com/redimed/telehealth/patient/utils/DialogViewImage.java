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
public class DialogViewImage extends Dialog implements View.OnClickListener, View.OnTouchListener {

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

    //    @Bind(R.id.imgView)
//    TouchImageView imgView;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;
    @Bind(R.id.btnClose)
    Button btnClose;
    @Bind(R.id.btnRotate)
    Button btnRotate;
    @Bind(R.id.txtAlert)
    TextView txtAlert;

    @Bind(R.id.imgView)
    ImageView imgView;

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
//        imgView.setOnTouchListener(this);

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
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.load(imgUrl)
                .error(R.drawable.icon_error_image)
                .fit().into(imgView, new Callback() {
            @Override
            public void onSuccess() {
                progressBar.setVisibility(View.GONE);
                btnClose.setVisibility(View.VISIBLE);
            }

            @Override
            public void onError() {
                progressBar.setVisibility(View.GONE);
                btnRotate.setVisibility(View.GONE);
                txtAlert.setVisibility(View.VISIBLE);
                btnClose.setVisibility(View.VISIBLE);
            }
        });

//        picasso.load(imgUrl)
//                .error(R.drawable.icon_error_image)
//                .into(new Target() {
//                    @Override
//                    public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
//                        progressBar.setVisibility(View.GONE);
//                        btnClose.setVisibility(View.VISIBLE);
//                        LoadImage(bitmap);
//                    }
//
//                    @Override
//                    public void onBitmapFailed(Drawable errorDrawable) {
//                    }
//
//                    @Override
//                    public void onPrepareLoad(Drawable placeHolderDrawable) {
//                    }
//                });
    }

    private void LoadImage(Bitmap bitmap) {
        if (imgBitmap != null) {
            imgView.setImageBitmap(bitmap);
            imgView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    index = ++index % scaleTypes.length;
                    ImageView.ScaleType currentScaleType = scaleTypes[index];
                    imgView.setScaleType(currentScaleType);
                }
            });
        }
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

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        // handle touch events here
        ImageView view = (ImageView) v;
        switch (event.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_DOWN:
                savedMatrix.set(matrix);
                start.set(event.getX(), event.getY());
                mode = DRAG;
                lastEvent = null;
                break;
            case MotionEvent.ACTION_POINTER_DOWN:
                oldDist = spacing(event);
                if (oldDist > 10f) {
                    savedMatrix.set(matrix);
                    midPoint(mid, event);
                    mode = ZOOM;
                }
                lastEvent = new float[4];
                lastEvent[0] = event.getX(0);
                lastEvent[1] = event.getX(1);
                lastEvent[2] = event.getY(0);
                lastEvent[3] = event.getY(1);
                d = rotation(event);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_POINTER_UP:
                mode = NONE;
                lastEvent = null;
                break;
            case MotionEvent.ACTION_MOVE:
                if (mode == DRAG) {
                    matrix.set(savedMatrix);
                    float dx = event.getX() - start.x;
                    float dy = event.getY() - start.y;
                    matrix.postTranslate(dx, dy);
                } else if (mode == ZOOM) {
                    float newDist = spacing(event);
                    if (newDist > 10f) {
                        matrix.set(savedMatrix);
                        float scale = (newDist / oldDist);
                        matrix.postScale(scale, scale, mid.x, mid.y);
                    }
                    if (lastEvent != null && event.getPointerCount() == 3) {
                        newRot = rotation(event);
                        float r = newRot - d;
                        float[] values = new float[9];
                        matrix.getValues(values);
                        float tx = values[2];
                        float ty = values[5];
                        float sx = values[0];
                        float xc = (view.getWidth() / 2) * sx;
                        float yc = (view.getHeight() / 2) * sx;
                        matrix.postRotate(r, tx + xc, ty + yc);
                    }
                }
                break;
        }
        view.setImageMatrix(matrix);
        return true;
    }

    private float spacing(MotionEvent event) {
        float x = event.getX(0) - event.getX(1);
        float y = event.getY(0) - event.getY(1);
        return (float) Math.sqrt(x * x + y * y);
    }

    private void midPoint(PointF point, MotionEvent event) {
        float x = event.getX(0) + event.getX(1);
        float y = event.getY(0) + event.getY(1);
        point.set(x / 2, y / 2);
    }

    private float rotation(MotionEvent event) {
        double delta_x = (event.getX(0) - event.getX(1));
        double delta_y = (event.getY(0) - event.getY(1));
        double radians = Math.atan2(delta_y, delta_x);
        return (float) Math.toDegrees(radians);
    }
}

