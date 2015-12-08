package com.redimed.telehealth.patient;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;

import butterknife.Bind;
import butterknife.ButterKnife;

public class LauncherActivity extends AppCompatActivity {

    private String TAG = "Launcher";
    private MyApplication mApplication;
    private SharedPreferences uidTelehealth;

    @Bind(R.id.logo)
    ImageView mLogo;
    @Bind(R.id.welcome_text)
    TextView txtWelcome;
    @Bind(R.id.launcherLayout)
    RelativeLayout launcherLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launcher);
        ButterKnife.bind(this);

        Picasso.with(this).load(R.drawable.logo_redimed).into(mLogo);
        launcherLayout.setBackgroundResource(R.drawable.bg_activation);

        mApplication = (MyApplication) getApplicationContext();
        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);

        AnimationLogo();
        AnimationWelcome();
        overridePendingTransition(0, 0);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                CheckExistsData();
            }
        }, 3500);
    }

    private void CheckExistsData(){
        File xmlUser = new File("/data/data/" + getApplicationContext().getPackageName() + "/shared_prefs/TelehealthUser.xml");
        if (xmlUser.exists()) {
            startActivity(new Intent(getApplicationContext(), MainActivity.class));
            finish();
        } else {
            startActivity(new Intent(getApplicationContext(), ActivationActivity.class));
            finish();
        }
    }

    private void AnimationLogo() {
        mLogo.setAlpha(1.0F);
        Animation anim = AnimationUtils.loadAnimation(this, R.anim.translate_top_to_center);
        mLogo.startAnimation(anim);
    }

    private void AnimationWelcome() {
        ObjectAnimator alphaAnimation = ObjectAnimator.ofFloat(txtWelcome, "alpha", 0.0F, 1.0F);
        alphaAnimation.setStartDelay(1700);
        alphaAnimation.setDuration(500);
        alphaAnimation.start();
    }
}
