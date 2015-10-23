package com.redimed.telehealth.patient.utils;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.widget.CardView;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 10/20/2015.
 */
public class DialogConnection extends Dialog implements View.OnClickListener {

    private Context context;

    @Bind(R.id.btnSettings)
    Button btnSettings;
    @Bind(R.id.btnSkip)
    Button btnSkip;

    public DialogConnection(Context c) {
        super(c);
        this.context = c;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.custom_connection_dialog);
        ButterKnife.bind(this);

        btnSettings.setOnClickListener(this);
        btnSkip.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnSettings:
                context.startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS));
                dismiss();
                break;
            case R.id.btnSkip:
                dismiss();
                break;
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_OUTSIDE){
            return true;
        }
        return false;
    }
}
