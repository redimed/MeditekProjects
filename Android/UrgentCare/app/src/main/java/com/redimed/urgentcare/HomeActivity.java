package com.redimed.urgentcare;

import android.annotation.TargetApi;
import android.content.Intent;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Display;
import android.widget.Button;
import android.widget.ImageView;

import com.andexert.library.RippleView;
import com.google.gson.JsonObject;
import com.redimed.urgentcare.api.UrgentRequestApi;
import com.redimed.urgentcare.utils.BlurTransformation;
import com.redimed.urgentcare.utils.RetrofitClient;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity extends AppCompatActivity {
    @Bind(R.id.btnMakeAppointment) Button btnMakeAppointment;
    @Bind(R.id.btnSportInjury) Button btnSportInjury;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.btnFAQ) Button btnFAQ;
    @Bind(R.id.imgLogoRedimed) ImageView imgLogoRedimed;
    @Bind(R.id.imgBackgroundHome) ImageView imgBackgroundHome;
    @Bind(R.id.rippleViewSportInjury) RippleView rippleViewSportInjury;
    @Bind(R.id.rippleViewWorkInjury) RippleView rippleViewWorkInjury;
    @Bind(R.id.rippleViewFAQ) RippleView rippleViewFAQ;
    @Bind(R.id.rippleViewMakeAppointment) RippleView rippleViewMakeAppointment;

    private static final int BACKGROUND_IMAGES_WIDTH = 360;
    private static final int BACKGROUND_IMAGES_HEIGHT = 360;
    private static final float BLUR_RADIUS = 25F;

    private BlurTransformation blurTransformation;
    private int backgroundIndex;
    private Point backgroundImageTargetSize;

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        // Initialize default values
        ButterKnife.bind(this);

        mCreateAndSaveFile();
//        mReadJsonData();

        Picasso.with(HomeActivity.this).load(R.drawable.img_logo_redimed).fit().into(imgLogoRedimed);
        blurTransformation = new BlurTransformation(this, BLUR_RADIUS);
        backgroundImageTargetSize = calculateBackgroundImageSizeCroppedToScreenAspectRatio(
                getWindowManager().getDefaultDisplay());


        Picasso.with(this).load(R.drawable.bg_home)
        .resize(backgroundImageTargetSize.x, backgroundImageTargetSize.y).centerCrop()
        .transform(blurTransformation).into(imgBackgroundHome);



        // Initialize controls

        rippleViewMakeAppointment.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToMakeAppointmentPage = new Intent(HomeActivity.this, MakeAppointmentActivity.class);
                startActivity(movedToMakeAppointmentPage);
            }
        });

        rippleViewSportInjury.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToSportInjuryPage = new Intent(HomeActivity.this, SportInjuryActivity.class);
                startActivity(movedToSportInjuryPage);
            }
        });
        rippleViewFAQ.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToFAQPage = new Intent(HomeActivity.this, FAQActivity.class);
                startActivity(movedToFAQPage);
            }
        });
        rippleViewWorkInjury.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToWorkInjuryPage = new Intent(HomeActivity.this, WorkInjuryActivity.class);
                startActivity(movedToWorkInjuryPage);
            }
        });
    }

    public void mCreateAndSaveFile() {
        File file = new File("/data/data/" + getApplicationContext().getPackageName() + "/" + "suburb.json");
        if(!file.exists()){
            UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
            urgentApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    try {
                        FileWriter file = new FileWriter("/data/data/" + getApplicationContext().getPackageName() + "/" + "suburb.json");
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                        Log.d("createfile","/data/data/" + getApplicationContext().getPackageName() + "/" + "suburb.json");
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }

    private static Point calculateBackgroundImageSizeCroppedToScreenAspectRatio(Display display) {
        final Point screenSize = new Point();
        getSizeCompat(display, screenSize);
        int scaledWidth = (int) (((double) BACKGROUND_IMAGES_HEIGHT * screenSize.x) / screenSize.y);
        int croppedWidth = Math.min(scaledWidth, BACKGROUND_IMAGES_WIDTH);
        int scaledHeight = (int) (((double) BACKGROUND_IMAGES_WIDTH * screenSize.y) / screenSize.x);
        int croppedHeight = Math.min(scaledHeight, BACKGROUND_IMAGES_HEIGHT);
        return new Point(croppedWidth, croppedHeight);
    }

    @SuppressWarnings("deprecation")
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private static void getSizeCompat(Display display, Point screenSize) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            display.getSize(screenSize);
        } else {
            screenSize.x = display.getWidth();
            screenSize.y = display.getHeight();
        }
    }
}
