package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

public class CallActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.imgLogoCall) ImageView imgLogoCall;
    @Bind(R.id.btnDecline) Button btnDecline;
    @Bind(R.id.btnAnswer) Button btnAnswer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);

        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.logo_bg_redimed).transform(new BlurTransformation(getApplicationContext(), 15)).into(imgLogoCall);
        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case (R.id.btnDecline):
                BackHome();
                break;
            case (R.id.btnAnswer):
                AnswerCommunication();
                break;
        }
    }

    private void AnswerCommunication() {
        Intent i = new Intent(getApplicationContext(), VoiceActivity.class);
        startActivity(i);
    }

    private void BackHome() {
        Intent i = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(i);
    }
}
