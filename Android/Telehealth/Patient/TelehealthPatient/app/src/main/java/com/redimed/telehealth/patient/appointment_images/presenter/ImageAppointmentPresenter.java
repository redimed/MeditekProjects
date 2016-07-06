package com.redimed.telehealth.patient.appointment_images.presenter;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AlertDialog;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.appointment_images.view.IImageAppointmentView;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class ImageAppointmentPresenter implements IImageAppointmentPresenter {

    private Context context;
    private FragmentActivity activity;
    private IImageAppointmentView iImageAppointmentView;

    private Uri fileUri; //file to store image
    private static final int MEDIA_TYPE_IMAGE = 1;

    protected MyApplication application;

    public ImageAppointmentPresenter(Context context, IImageAppointmentView iImageAppointmentView, FragmentActivity fragmentActivity) {
        this.context = context;
        this.activity = fragmentActivity;
        this.iImageAppointmentView = iImageAppointmentView;
        this.application = (MyApplication) context.getApplicationContext();

        application.setCurrentActivity(activity);
    }

    @Override
    public Uri getOutputMediaFileUri(int type) {
        fileUri = Uri.fromFile(getOutputMediaFile(type));
        return fileUri;
    }

    private static File getOutputMediaFile(int type) {
        // Create a media file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        File mediaFile = null;

        // External sdcard location
        File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "Telehealth");
        // Create the storage directory if it does not exist
        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                mediaStorageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
                return mediaFile;
            }
        }

        if (type == MEDIA_TYPE_IMAGE) {
            mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
        } else {
            return null;
        }
        return mediaFile;
    }

    @Override
    public String cameraPatch() {
        return fileUri.getPath();
    }

    @Override
    public String galleryPatch(Intent data) {
        Cursor cursor;
        int columnIndex;
        String picturePath;

        //Get uri image
        Uri selectedImage = data.getData();
        String[] filePathColumn = {MediaStore.Images.Media.DATA};

        //Get cursor
        cursor = context.getContentResolver().query(selectedImage, filePathColumn, null, null, null);
        assert cursor != null;
        cursor.moveToFirst();

        //Get path form cursor index
        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
        picturePath = cursor.getString(columnIndex);
        cursor.close();

        return picturePath;
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
    }
}
