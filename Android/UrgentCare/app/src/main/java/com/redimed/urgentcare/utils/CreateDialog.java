package com.redimed.urgentcare.utils;

import android.app.Activity;
import android.app.Dialog;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.urgentcare.R;

/**
 * Created by phanq on 09/21/2015.
 */
public class CreateDialog {
    public void CreateDialog(final Activity activity, String msg, final int layout,int colorImg,int iconImg,int colorBtn, final boolean funSuccess){
        final Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(layout);

        ImageView img = (ImageView) dialog.findViewById(R.id.imgDialog);
        img.setBackgroundResource(colorImg);
        img.setImageResource(iconImg);

        TextView text = (TextView) dialog.findViewById(R.id.lblDialog);
        text.setText(msg);

        Button dialogButton = (Button) dialog.findViewById(R.id.btnDidlog);
        dialogButton.setBackgroundResource(colorBtn);
        dialogButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            if(funSuccess){
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
