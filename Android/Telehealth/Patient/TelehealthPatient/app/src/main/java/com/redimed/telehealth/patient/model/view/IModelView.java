package com.redimed.telehealth.patient.model.view;

import android.graphics.Bitmap;

/**
 * Created by Fox on 1/20/2016.
 */
public interface IModelView {
    void onLoadImage(Bitmap bitmap);
    void onResultUpload(String msg);
}
