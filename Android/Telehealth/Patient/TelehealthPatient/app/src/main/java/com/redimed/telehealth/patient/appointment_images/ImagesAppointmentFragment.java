package com.redimed.telehealth.patient.appointment_images;


import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.ImageAppointmentAdapter;
import com.redimed.telehealth.patient.appointment_images.presenter.IImageAppointmentPresenter;
import com.redimed.telehealth.patient.appointment_images.presenter.ImageAppointmentPresenter;
import com.redimed.telehealth.patient.appointment_images.view.IImageAppointmentView;
import com.redimed.telehealth.patient.model.ModelActivity;
import com.redimed.telehealth.patient.tracking.TrackingFragment;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class ImagesAppointmentFragment extends Fragment implements IImageAppointmentView {

    private Bundle bundle;
    private Context context;
    private boolean flagLayout = false;
    private IImageAppointmentPresenter iImageAppointmentPresenter;
    private static final String TAG = "=====IMAGE_APPT=====";

    /* Choose an action image */
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int RESULT_RELOAD = 3;
    private static final int MEDIA_TYPE_IMAGE = 1;

    @Bind(R.id.lblImage)
    TextView lblImage;
    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;
    @Bind(R.id.fabUploadImage)
    FloatingActionButton fabUploadImage;

    public ImagesAppointmentFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_images_appointment, container, false);
        bundle = getArguments();
        ButterKnife.bind(this, v);
        this.context = v.getContext();
        iImageAppointmentPresenter = new ImageAppointmentPresenter(context, this, getActivity());

        init();
        fabUploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogUploadImage();
            }
        });
        return v;
    }

    private void init() {
        SharedPreferences spTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
        this.onLoadListImage(bundle.getStringArrayList("listImg"), spTelehealth);
    }

    public void dialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.setTitle("Choose an action");
        alertDialog.setMessage("Choose an action Camera or Gallery");

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Gallery", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(galleryIntent, RESULT_PHOTO);
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Camera", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, iImageAppointmentPresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE));
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        String picturePath = "";
        try {
            getActivity();
            if (resultCode == Activity.RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
                        picturePath = iImageAppointmentPresenter.galleryPatch(data);
                        flagLayout = true;
                        break;

                    case RESULT_CAMERA:
                        // Downsizing image as it throws OutOfMemory Exception for larger images
                        picturePath = iImageAppointmentPresenter.cameraPatch();
                        flagLayout = true;
                        break;

                    case RESULT_RELOAD:
                        FragmentTransaction ft = getFragmentManager().beginTransaction();
                        ft.detach(this).attach(this).commit();
                        flagLayout = false;
                        break;
                }
                if (flagLayout) {
                    Intent i = new Intent(context, ModelActivity.class);
                    i.putExtra("picturePath", picturePath);
                    i.putExtra("appointmentUID", bundle.getString("apptUID", ""));
                    startActivityForResult(i, RESULT_RELOAD);
                }
            } else {
                Toast.makeText(context, "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
    }

    public void onLoadListImage(ArrayList<String> listImage, SharedPreferences spTelehealth) {
        if (listImage != null) {
            if (spTelehealth != null) {
                ImageAppointmentAdapter imageAppointmentAdapter = new ImageAppointmentAdapter(context, listImage, spTelehealth);

//                PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
//                layoutManagerCategories.setOrientation(LinearLayoutManager.VERTICAL);
//                layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

                GridLayoutManager layoutManagerCategories = new GridLayoutManager(context, 4);
                rvImageAppointment.setLayoutManager(layoutManagerCategories);
                rvImageAppointment.setAdapter(imageAppointmentAdapter);
            }
            if (listImage.size() <= 0)
                lblImage.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        iImageAppointmentPresenter.changeFragment(new TrackingFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
