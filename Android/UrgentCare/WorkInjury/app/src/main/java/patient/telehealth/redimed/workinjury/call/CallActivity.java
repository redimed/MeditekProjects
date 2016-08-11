package patient.telehealth.redimed.workinjury.call;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;


import com.opentok.android.Publisher;
import com.opentok.android.Subscriber;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.call.presenter.CallPresenter;
import patient.telehealth.redimed.workinjury.call.presenter.ICallPresenter;
import patient.telehealth.redimed.workinjury.call.view.ICallView;
import patient.telehealth.redimed.workinjury.R;


public class CallActivity extends AppCompatActivity implements ICallView, View.OnClickListener, View.OnTouchListener {

    private int xDelta, yDelta;
    private ICallPresenter iCallPresenter;
    private String TAG = "======CALL======";

    @Bind(R.id.lblNameDoctor) TextView lblNameDoctor;
    @Bind(R.id.lblTimer) TextView lblTimer;
    @Bind(R.id.btnHold) Button btnHold;
    @Bind(R.id.btnEndCall) Button btnEndCall;
    @Bind(R.id.btnMutePub) Button btnMutePub;
    @Bind(R.id.btnMuteSub) Button btnMuteSub;
    @Bind(R.id.callLayout) RelativeLayout callLayout;
    @Bind(R.id.publisherView) RelativeLayout publisherView;
    @Bind(R.id.subscriberView) RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner) ProgressBar loadingBar;

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
        switch (v.getId()) {
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
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(300, 300);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);

        publisherView.addView(publisher.getView(), layoutPublisher);
        publisherView.setOnTouchListener(this);
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        int X = (int) event.getRawX();
        int Y = (int) event.getRawY();
        Log.d(TAG, X + " X===Y " + Y);
        switch (event.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_DOWN:
                RelativeLayout.LayoutParams lParams = (RelativeLayout.LayoutParams) v.getLayoutParams();
                xDelta = X - lParams.rightMargin;
                yDelta = Y - lParams.topMargin;
                Log.d(TAG, xDelta + " === " + yDelta);
                break;
            case MotionEvent.ACTION_UP:

                break;
            case MotionEvent.ACTION_POINTER_DOWN:
                break;
            case MotionEvent.ACTION_POINTER_UP:
                break;
            case MotionEvent.ACTION_MOVE:
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) v.getLayoutParams();
                layoutParams.leftMargin = X - xDelta;
                layoutParams.topMargin = Y - yDelta;
                layoutParams.rightMargin = 1024;
                layoutParams.bottomMargin = 768;
                v.setLayoutParams(layoutParams);
                break;
        }
        callLayout.invalidate();
        return true;
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
        switch (viewer) {
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
