package com.redimed.telehealth.patient.request.view;

import android.graphics.Bitmap;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

/**
 * Created by Fox on 1/22/2016.
 */
public interface IRequestView {

    void changeViewFlipper();

    void onLoadSuccess();

    void onLoadDOB(String dob);

    void onLoadError(String msg);

    void onResultEmail(boolean email);

    void onResultMobile(boolean phone);

    void onResultSuburb(boolean suburb);

    void onResultField(EditText editText);

    void onResultApptType(boolean apptType);

    void onLoadImgSignature(Bitmap bitmap, String path);

    void onLoadGallery(ArrayList<CustomGallery> customGalleries);
}
