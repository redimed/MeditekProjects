package com.redimed.telehealth.patient.appointment_images.presenter;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.Fragment;

/**
 * Created by MeditekMini on 6/7/16.
 */
public interface IImageAppointmentPresenter {

    String cameraPatch();

    String galleryPatch(Intent data);

    Uri getOutputMediaFileUri(int type);

    void changeFragment(Fragment fragment);
}
