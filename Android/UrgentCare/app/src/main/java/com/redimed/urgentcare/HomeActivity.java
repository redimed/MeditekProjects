package com.redimed.urgentcare;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;

import butterknife.Bind;
import butterknife.ButterKnife;

public class HomeActivity extends AppCompatActivity {
    @Bind(R.id.btnMakeAppointment) Button btnMakeAppointment;
    @Bind(R.id.btnSportInjury) Button btnSportInjury;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.btnFAQ) Button btnFAQ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        // Initialize default values
        ButterKnife.bind(this);
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
}
