package com.redimed.urgentcare;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.redimed.urgentcare.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

public class HomeActivity extends AppCompatActivity {
    @Bind(R.id.imgBackgroundHome) ImageView imgBackgroundHome;
    @Bind(R.id.imgBackgroundLogo) ImageView imgBackgroundLogo;
    @Bind(R.id.imgLogoRedimed)  ImageView imgLogoRedimed;
    @Bind(R.id.btnMakeAppointment) Button btnMakeAppointment;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        // Initialize default values
        ButterKnife.bind(this);
        Picasso.with(this).load(R.drawable.bg_home).fit().into(imgBackgroundHome);
        Picasso.with(this).load(R.drawable.bg_logo_redimed).transform(new BlurTransformation(getApplicationContext(),25)).fit().into(imgBackgroundLogo);
        Picasso.with(this).load(R.drawable.img_logo_redimed).fit().into(imgLogoRedimed);
        // Initialize controls
        btnMakeAppointment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToMakeAppointmentPage = new Intent(HomeActivity.this, MakeAppointmentActivity.class);
                startActivity(movedToMakeAppointmentPage);
            }
        });


    }
}
