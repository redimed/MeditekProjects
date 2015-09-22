package com.redimed.telehealth.patient;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import butterknife.Bind;
import butterknife.ButterKnife;

public class VoiceActivity extends AppCompatActivity implements View.OnClickListener {

    Intent i;

    private static final int RESULT_LOAD_IMAGES = 1313;
    private static final int CAMERA_PIC_REQUEST = 1337;

    @Bind(R.id.btnShareImage) Button btnShareImage;
    @Bind(R.id.btnDeclineVoice) Button btnDeclineVoice;
    @Bind(R.id.btnMute) Button btnMute;
    @Bind(R.id.btnHold) Button btnHold;
    Boolean listenBtnHold = true;
    Boolean listenBtnMute = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voice);

        ButterKnife.bind(this);

        btnShareImage.setOnClickListener(this);
        btnDeclineVoice.setOnClickListener(this);
        btnMute.setOnClickListener(this);
        btnHold.setOnClickListener(this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_voice, menu);
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
            case R.id.btnShareImage:
                DisplayDialog();
                break;
            case R.id.btnHold:
                HoldCommunication();
                break;
            case R.id.btnMute:
                MuteCommunication();
                break;
            case R.id.btnDeclineVoice:
                DeclineVoiceCall();
                break;
        }
    }

    private void HoldCommunication() {
        if (listenBtnHold){

        }
    }

    private void MuteCommunication() {
        if (listenBtnMute){
            btnMute.setBackgroundResource(R.drawable.icon_mute);
            listenBtnMute = false;
        }else {
            btnMute.setBackgroundResource(R.drawable.icon_speaker);
            listenBtnMute = true;
        }
    }

    private void DeclineVoiceCall() {
        i = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(i);
    }

    //Display dialog choose open action Photo Library or Camera
    private void DisplayDialog() {
        AlertDialog.Builder alertDialogChooseImageResource = new AlertDialog.Builder(this);
        alertDialogChooseImageResource.setTitle(R.string.title_dialog);
        alertDialogChooseImageResource.setMessage("");

        alertDialogChooseImageResource.setNegativeButton(R.string.title_photo, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                i = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(i, RESULT_LOAD_IMAGES);
            }
        });

        alertDialogChooseImageResource.setPositiveButton(R.string.title_camera, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(i, CAMERA_PIC_REQUEST);
            }
        });
        alertDialogChooseImageResource.show();
    }
}
