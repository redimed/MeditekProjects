package com.redimed.telehealth.patient.redisite.image.presenter;

import android.net.Uri;

import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

/**
 * Created by MeditekPro on 6/30/16.
 */
public interface IImagePresenter {

    Uri getOutputMediaFileUri(int type);

    ArrayList<CustomGallery> setImageGallery(String[] allPath);
}
