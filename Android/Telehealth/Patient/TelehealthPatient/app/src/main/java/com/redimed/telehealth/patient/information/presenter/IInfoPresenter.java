package com.redimed.telehealth.patient.information.presenter;

import android.net.Uri;
import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.EditText;

import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoPresenter {

    void loadAvatar(String url);

    void getInfoPatient(String uid);

    Uri getOutputMediaFileUri(int type);

    void hideKeyboardFragment(View view);

    void downloadSignature(String url);

    void changeFragment(Fragment fragment);

    void saveBitmapSign(SignaturePad signaturePad);

    void updateProfile(ArrayList<EditText> arrEditText);

    void changeViewUpdate(ArrayList<EditText> arrEditText);
}
