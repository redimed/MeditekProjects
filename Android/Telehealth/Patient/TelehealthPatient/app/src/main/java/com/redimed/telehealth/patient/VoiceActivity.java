package com.redimed.telehealth.patient;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.utils.OpenTokConfig;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

public class VoiceActivity extends AppCompatActivity implements View.OnClickListener, Session.SessionListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener {

    Intent i;

    private static final int RESULT_LOAD_IMAGES = 1313;
    private static final int CAMERA_PIC_REQUEST = 1337;
    private static final String LOGTAG = "OpenTok";
//    @Bind(R.id.btnShareImage) Button btnShareImage;
//    @Bind(R.id.btnDeclineVoice) Button btnDeclineVoice;
//    @Bind(R.id.btnMute) Button btnMute;
//    @Bind(R.id.btnHold) Button btnHold;
    @Bind(R.id.publisherView) RelativeLayout publisherView;
    @Bind(R.id.subscriberView) RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner) ProgressBar loadingBar;
    Boolean listenBtnHold = true;
    Boolean listenBtnMute = true;

    private Session sessionOpenTok;
    private Publisher publisher;
    private Subscriber subscriber;
    private ArrayList<Stream> streamOpenTok;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voice);

        ButterKnife.bind(this);

//        btnShareImage.setOnClickListener(this);
//        btnDeclineVoice.setOnClickListener(this);
//        btnMute.setOnClickListener(this);
//        btnHold.setOnClickListener(this);

        streamOpenTok = new ArrayList<Stream>();
        SessionConnect();
    }

    private void SessionConnect() {
        if (sessionOpenTok == null){
            sessionOpenTok = new Session(VoiceActivity.this, OpenTokConfig.API_KEY, OpenTokConfig.SESSION_ID);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.connect(OpenTokConfig.TOKEN);
        }
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
//        switch (v.getId()){
//            case R.id.btnShareImage:
//                DisplayDialog();
//                break;
//            case R.id.btnHold:
//                HoldCommunication();
//                break;
//            case R.id.btnMute:
//                MuteCommunication();
//                break;
//            case R.id.btnDeclineVoice:
//                DeclineVoiceCall();
//                break;
//        }
    }

    private void HoldCommunication() {
        if (listenBtnHold){

        }
    }

    private void MuteCommunication() {
        if (listenBtnMute){
//            btnMute.setBackgroundResource(R.drawable.icon_mute);
            listenBtnMute = false;
        }else {
//            btnMute.setBackgroundResource(R.drawable.icon_speaker);
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

    @Override
    public void onConnected(Session session) {
        if (publisher == null){
            publisher = new Publisher(VoiceActivity.this, "publisher");
            publisher.setPublisherListener(this);
            AttachPublisherView(publisher);
            sessionOpenTok.publish(publisher);
        }
    }

    private void AttachPublisherView(Publisher paramPublisher) {
        publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(500, 500);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);
        publisherView.addView(publisher.getView(), layoutPublisher);
    }

    public void AttachSubscriberView(Subscriber paramSubscriber){
        RelativeLayout.LayoutParams layoutSubscriber = new RelativeLayout.LayoutParams(
                getResources().getDisplayMetrics().widthPixels,
                getResources().getDisplayMetrics().heightPixels);
        subscriberView.addView(subscriber.getView(), layoutSubscriber);
        paramSubscriber.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
    }

    @Override
    public void onDisconnected(Session session) {
        if (publisher != null){
            publisherView.removeView(publisher.getView());
        }

        if (subscriber != null){
            subscriberView.removeView(subscriber.getView());
        }

        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok = null;
    }

    private void SubscribeToStream(Stream stream) {
        subscriber = new Subscriber(VoiceActivity.this, stream);
        subscriber.setVideoListener(this);
    }

    @Override
    public void onStreamDropped(Session session, Stream stream) {
        if (!OpenTokConfig.SUBSCRIBE_TO_SELF) {
            if (subscriber != null) {
                UnsubscribeFromStream(stream);
            }
        }
    }

    @Override
    public void onError(Session session, OpentokError opentokError) {
        Log.i(LOGTAG, "Publisher exception: " + opentokError.getMessage());
    }

    @Override
    public void onStreamCreated(PublisherKit publisherKit, Stream stream) {
        if (OpenTokConfig.SUBSCRIBE_TO_SELF){
            streamOpenTok.add(stream);
            if (subscriber == null){
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamReceived(Session session, Stream stream) {
        if (!OpenTokConfig.SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
        if (OpenTokConfig.SUBSCRIBE_TO_SELF && subscriber != null){
            UnsubscribeFromStream(stream);
        }
    }

    private void UnsubscribeFromStream(Stream stream) {
        streamOpenTok.remove(stream);
        if (subscriber.getStream().getStreamId().equals(stream.getStreamId())){
            subscriberView.removeView(subscriber.getView());
            subscriber = null;
            if (!streamOpenTok.isEmpty()){
                SubscribeToStream(streamOpenTok.get(0));
            }
        }
    }

    @Override
    public void onError(PublisherKit publisherKit, OpentokError opentokError) {
        Log.i(LOGTAG, "Publisher exception: " + opentokError.getMessage());
    }

    /**
     * Converts dp to real pixels, according to the screen density.
     *
     * @param dp A number of density-independent pixels.
     * @return The equivalent number of real pixels.
     */
    private int dpToPx(int dp) {
        double screenDensity = this.getResources().getDisplayMetrics().density;
        return (int) (screenDensity * (double) dp);
    }

    @Override
    public void onVideoDataReceived(SubscriberKit subscriberKit) {
        loadingBar.setVisibility(View.GONE);
        AttachSubscriberView(subscriber);
    }

    @Override
    public void onVideoDisabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoEnabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoDisableWarning(SubscriberKit subscriberKit) {

    }

    @Override
    public void onVideoDisableWarningLifted(SubscriberKit subscriberKit) {

    }
}
