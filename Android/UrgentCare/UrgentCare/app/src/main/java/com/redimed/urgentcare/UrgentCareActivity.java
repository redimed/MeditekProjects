package com.redimed.urgentcare;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.andexert.library.RippleView;

import butterknife.Bind;
import butterknife.ButterKnife;

public class UrgentCareActivity extends AppCompatActivity {
    @Bind(R.id.rippleViewCloseUrgentCarePage) RippleView rippleViewCloseUrgentCarePage;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_urgent_care);
        ButterKnife.bind(this);
        rippleViewCloseUrgentCarePage.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                finish();
            }
        });
    }

}
