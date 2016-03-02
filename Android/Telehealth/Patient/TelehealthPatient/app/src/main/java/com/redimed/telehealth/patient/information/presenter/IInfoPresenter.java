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
    void hideKeyboardFragment(View view);
    void getInfoPatient(String uid);
    void loadAvatar(String url);
    void changeFragment(Fragment fragment);
    void changeViewUpdate(ArrayList<EditText> arrEditText);
    void updateProfile(ArrayList<EditText> arrEditText);
    void saveBitmapSign(SignaturePad signaturePad);
    Uri getOutputMediaFileUri(int type);
}
