package com.redimed.telehealth.patient.model.presenter;

import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.widget.ProgressBar;

import com.redimed.telehealth.patient.model.view.IModelView;

/**
 * Created by Fox on 1/20/2016.
 */
public interface IModelPresenter {
    void getScaledBitmap(Bitmap bitmap, int rotation);
    void uploadProgress(ProgressBar progressBar, String picturePath, String appointmentUID, String bodyPart, SharedPreferences uidTelehealth, IModelView iModelView);
}
