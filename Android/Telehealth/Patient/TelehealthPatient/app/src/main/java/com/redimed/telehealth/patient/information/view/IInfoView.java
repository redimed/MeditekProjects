package com.redimed.telehealth.patient.information.view;

import android.graphics.Bitmap;

import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoView {
    void displayInfo(Patient[] patient);
    void onLoadAvatar(Bitmap bitmap);
    void onLoadToolbar();
    void onLoadError(String msg);
}
