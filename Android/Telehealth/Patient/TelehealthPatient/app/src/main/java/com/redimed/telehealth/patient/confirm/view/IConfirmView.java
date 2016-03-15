package com.redimed.telehealth.patient.confirm.view;

import android.graphics.Bitmap;

/**
 * Created by Fox on 3/2/2016.
 */
public interface IConfirmView {

    void onLoadSuccess();

    void onLoadError(String msg);

    void onLoadImgSignature(Bitmap bitmap, String path);

}
