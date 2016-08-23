package patient.telehealth.redimed.workinjury.waiting;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.receiver.BootReceiver;
import patient.telehealth.redimed.workinjury.waiting.presenter.IWaitingPresenter;
import patient.telehealth.redimed.workinjury.waiting.presenter.WaitingPresenter;
import patient.telehealth.redimed.workinjury.waiting.view.IWaitingView;

public class WaitingActivity extends AppCompatActivity implements IWaitingView, View.OnClickListener {

//    private boolean flagDestroy = false;
//    private SharedPreferences callPreferences;
    private IWaitingPresenter iWaitingPresenter;
    private NotificationManager notificationManager;
    private LocalBroadcastManager localBroadcastManager;
    private static final String TAG = "=====WAITING=====";

    @Bind(R.id.lblNameCaller) TextView lblNameCaller;
    @Bind(R.id.btnDecline) Button btnDecline;
    @Bind(R.id.btnAnswer) Button btnAnswer;
    @Bind(R.id.waitCallLayout) RelativeLayout waitCallLayout;

    BootReceiver receiver = new BootReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equalsIgnoreCase("call.action.finish")) {
                finish();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_waiting);
        ButterKnife.bind(this);
        initVariable();

        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);
    }

    private void initVariable() {
        iWaitingPresenter = new WaitingPresenter(this, this);
        iWaitingPresenter.playRingTone();
        iWaitingPresenter.listenSocket(getIntent());

//        callPreferences = getSharedPreferences("FlagCall", MODE_PRIVATE);

        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("call.action.finish");
        localBroadcastManager.registerReceiver(receiver, intentFilter);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnDecline:
//                flagDestroy = true;
                iWaitingPresenter.declineCall();
                break;
            case R.id.btnAnswer:
//                flagDestroy = true;
                iWaitingPresenter.answerCall();
                break;
        }
    }

    @Override
    public void onBackPressed() {
        return;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        iWaitingPresenter.playRingTone();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onPause() {
        super.onPause();
        iWaitingPresenter.stopRingTone();
    }

    @Override
    public void onLoadNameCaller(String name) {
        lblNameCaller.setText(name);
    }

    @Override
    public void onLoadAvatar(Bitmap bitmap) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
            waitCallLayout.setBackgroundDrawable(new BitmapDrawable(getResources(), bitmap));
            waitCallLayout.invalidate();
        } else {
            waitCallLayout.setBackground(new BitmapDrawable(getResources(), bitmap));
            waitCallLayout.invalidate();
        }
    }

    @Override
    public void onResultDecline() {
//        flagDestroy = true;
        finish();
    }

    @Override
    public void onResultAnswer(Intent intent) {
        startActivity(intent);
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        notificationManager.cancel(0);
        iWaitingPresenter.stopRingTone();
        localBroadcastManager.unregisterReceiver(receiver);
//        if (!flagDestroy) {
//            iWaitingPresenter.declineCall();
//        }
//        if (callPreferences.getBoolean("isBackground", false)) {
//            Log.d(TAG, "isBackground");
//            Intent i = new Intent(this, MainActivity.class);
//            i.addFlags(Intent.FLAG_ACTIVITY_PREVIOUS_IS_TOP);
//            startActivity(i);
//        }
    }
}
