package com.example.phanq.meditekapp.utils;

import android.app.Activity;
import android.app.Dialog;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import com.example.phanq.meditekapp.R;

/**
 * Created by phanq on 09/21/2015.
 */
public class ViewDialog {
    public void showDialog(final Activity activity, String msg, final int layout){
        final Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(layout);

        TextView text = (TextView) dialog.findViewById(R.id.text_dialog);
        text.setText(msg);

        Button dialogButton = (Button) dialog.findViewById(R.id.btn_dialog);
        dialogButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(R.layout.dialogsuccess == layout){
                    dialog.dismiss();
                    activity.finish();
                }else {
                    dialog.dismiss();
                }
            }
        });

        dialog.show();

    }
}
