package com.redimed.telehealth.patient.redisite.image.presenter;

import android.net.Uri;

/**
 * Created by MeditekPro on 6/30/16.
 */
public interface IImagePresenter {

    Uri getOutputMediaFileUri(int type);

    void setImageGallery(String[] allPath);
}
