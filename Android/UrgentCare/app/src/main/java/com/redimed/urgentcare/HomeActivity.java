package com.redimed.urgentcare;

import android.annotation.TargetApi;
import android.content.Intent;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Display;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.redimed.urgentcare.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

public class HomeActivity extends AppCompatActivity{
    @Bind(R.id.btnMakeAppointment) Button btnMakeAppointment;
    @Bind(R.id.btnSportInjury) Button btnSportInjury;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.btnFAQ) Button btnFAQ;
    @Bind(R.id.imgLogoRedimed) ImageView imgLogoRedimed;
    @Bind(R.id.imgBackgroundHome) ImageView imgBackgroundHome;

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
        Picasso.with(HomeActivity.this).load(R.drawable.aaaa).fit().into(imgLogoRedimed);

        blurTransformation = new BlurTransformation(this, BLUR_RADIUS);
        backgroundImageTargetSize = calculateBackgroundImageSizeCroppedToScreenAspectRatio(
        getWindowManager().getDefaultDisplay());

        Picasso.with(this).load(R.drawable.bg_home3)
        .resize(backgroundImageTargetSize.x, backgroundImageTargetSize.y).centerCrop()
        .transform(blurTransformation).into(imgBackgroundHome);

        // Initialize controls
        btnMakeAppointment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToMakeAppointmentPage = new Intent(HomeActivity.this, MakeAppointmentActivity.class);
                startActivity(movedToMakeAppointmentPage);
//                overridePendingTransition( R.anim.class, R.anim.slide_out_up );
            }
        });
        btnSportInjury.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToSportInjuryPage = new Intent(HomeActivity.this, SportInjuryActivity.class);
                startActivity(movedToSportInjuryPage);
            }
        });
        btnFAQ.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToFAQPage = new Intent(HomeActivity.this, FAQActivity.class);
                startActivity(movedToFAQPage);
            }
        });
        btnWorkInjury.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToWorkInjuryPage = new Intent(HomeActivity.this, WorkInjuryActivity.class);
                startActivity(movedToWorkInjuryPage);
            }
        });
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
