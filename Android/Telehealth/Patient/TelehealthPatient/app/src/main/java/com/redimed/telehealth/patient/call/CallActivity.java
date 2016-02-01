package com.redimed.telehealth.patient.call;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.opentok.android.Publisher;
import com.opentok.android.Subscriber;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.call.presenter.CallPresenter;
import com.redimed.telehealth.patient.call.presenter.ICallPresenter;
import com.redimed.telehealth.patient.call.view.ICallView;

import butterknife.Bind;
import butterknife.ButterKnife;

public class CallActivity extends AppCompatActivity implements ICallView, View.OnClickListener {

    private ICallPresenter iCallPresenter;

    @Bind(R.id.lblNameDoctor)
    TextView lblNameDoctor;
    @Bind(R.id.lblTimer)
    TextView lblTimer;
    @Bind(R.id.btnHold)
    Button btnHold;
    @Bind(R.id.btnEndCall)
    Button btnEndCall;
    @Bind(R.id.btnMutePub)
    Button btnMutePub;
    @Bind(R.id.btnMuteSub)
    Button btnMuteSub;
    @Bind(R.id.publisherView)
    RelativeLayout publisherView;
    @Bind(R.id.subscriberView)
    RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner)
    ProgressBar loadingBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        ButterKnife.bind(this);
        initVariable();

        btnHold.setOnClickListener(this);
        btnEndCall.setOnClickListener(this);
        btnMutePub.setOnClickListener(this);
        btnMuteSub.setOnClickListener(this);
    }

    private void initVariable() {
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        iCallPresenter = new CallPresenter(this, this);
        iCallPresenter.listenSocket(getIntent());
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnHold:
                iCallPresenter.holdCommunication();
                break;
            case R.id.btnMutePub:
                iCallPresenter.mutePublisher();
                break;
            case R.id.btnMuteSub:
                iCallPresenter.muteSubscriber();
                break;
            case R.id.btnEndCall:
                iCallPresenter.endCommunication();
                break;
        }
    }

    @Override
    public void onLoadNameCaller(String name) {
        lblNameDoctor.setText(name);
    }

    @Override
    public void onSocketSuccess() {
        iCallPresenter.socketConnection();
    }

    @Override
    public void onLoadProgress(int viewId) {
        loadingBar.setVisibility(viewId);
    }

    @Override
    public void onAttachPublisherView(Publisher publisher) {
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(500, 500);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);

        publisherView.addView(publisher.getView(), layoutPublisher);
    }

    private void enableButton() {
        btnMutePub.setEnabled(true);
        btnMuteSub.setEnabled(true);
        btnHold.setEnabled(true);
        btnEndCall.setEnabled(true);
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
    public void onAttachSubscriberView(Subscriber subscriber) {
        RelativeLayout.LayoutParams layoutSubscriber = new RelativeLayout.LayoutParams(
                getResources().getDisplayMetrics().widthPixels,
                getResources().getDisplayMetrics().heightPixels);

        subscriberView.addView(subscriber.getView(), layoutSubscriber);
        enableButton();
    }

    @Override
    public void onRemoveView(String viewer, View view) {
        switch (viewer){
            case "publisher":
                publisherView.removeView(view);
                break;
            case "subscriber":
                subscriberView.removeView(view);
                break;
        }
    }

    @Override
    public void onMuteSubscriber(int drawable) {
        btnMuteSub.setCompoundDrawablesWithIntrinsicBounds(drawable, 0, 0, 0);
    }

    @Override
    public void onMutePublisher(int drawable) {
        btnMutePub.setCompoundDrawablesWithIntrinsicBounds(drawable, 0, 0, 0);
    }

    @Override
    public void onEndCommunication() {
        finish();
    }

    @Override
    public void onLoadTimer(String timer) {
        lblTimer.setText(timer);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    @Override
    public void onBackPressed() {
        return;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
