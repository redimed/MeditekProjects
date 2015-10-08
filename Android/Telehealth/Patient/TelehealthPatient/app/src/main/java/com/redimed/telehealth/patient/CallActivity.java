package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

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
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_call, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case (R.id.btnDecline):
                BackHome();
                break;
            case (R.id.btnAnswer):
                DisplayVoice();
                break;
        }
    }

    private void DisplayVoice() {
        Intent i = new Intent(getApplicationContext(), VoiceActivity.class);
        startActivity(i);
    }

    private void BackHome() {
        Intent i = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(i);
    }
}
