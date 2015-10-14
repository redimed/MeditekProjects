package com.redimed.urgentcare;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.andexert.library.RippleView;

import butterknife.Bind;
import butterknife.ButterKnife;

public class FAQActivity extends AppCompatActivity {
    @Bind(R.id.rippleViewCloseFAQPage) RippleView rippleViewCloseFAQPage;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_faq);
        ButterKnife.bind(this);
        rippleViewCloseFAQPage.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                finish();
            }
        });
    }
}
