package com.redimed.telehealth.patient.fragment;


import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;


import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.ModelActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.utils.FloatingBtnAnimationControl;
import com.redimed.telehealth.patient.utils.RVAdapterImage;

import java.io.ByteArrayOutputStream;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class ImageAppointmentFragment extends Fragment {

    private View v;
    private Intent i;
    private String TAG = "LIST IMAGE";
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private String accountUID, appointmentUID;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapterImage rvAdapterImage;
    private List<String> urlPicasso;
    private FloatingBtnAnimationControl floatingBtnAnimationControl;

    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;
    @Bind(R.id.fabUploadImage)
    FloatingActionButton fabUploadImage;
    @Bind(R.id.btnUpload)
    Button btnUpload;

    public ImageAppointmentFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        v = inflater.inflate(R.layout.fragment_image_appointment, container, false);
        ButterKnife.bind(this, v);

        Bundle bundle = this.getArguments();
        accountUID = bundle.getString("accountUID");
        appointmentUID = bundle.getString("appointmentUID");
        urlPicasso = bundle.getStringArrayList("urlPicasso");

        rvImageAppointment.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(v.getContext());
        rvImageAppointment.setLayoutManager(layoutManagerCategories);
        rvAdapterImage = new RVAdapterImage();
        rvImageAppointment.setAdapter(rvAdapterImage);
        rvAdapterImage.swapData(urlPicasso);

        floatingBtnAnimationControl = new FloatingBtnAnimationControl(fabUploadImage);
        floatingBtnAnimationControl.lockScrollingDirection();

        fabUploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogUploadImage();
            }
        });

        btnUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogUploadImage();
            }
        });

        return v;
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

//        rvImageAppointment.setOnScrollListener(floatingBtnAnimationControl);
    }

    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
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
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        String picturePath = null;
        int columnIndex;
        Cursor cursor;
        Bitmap image = null;
        try {
            if (resultCode == getActivity().RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
                        //Get uri image
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        //Get cursor
                        cursor = v.getContext().getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                        cursor.moveToFirst();
                        //Get path form cursor index
                        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        break;

                    case RESULT_CAMERA:
                        //Get bitmap data image
                        image = (Bitmap) data.getExtras().get("data");
                        //Get uri image
                        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
                        image.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
                        String pathImageUri = MediaStore.Images.Media.insertImage(v.getContext().getContentResolver(), image, "Title", null);
                        //Get real path from uri image
                        cursor = v.getContext().getContentResolver().query(Uri.parse(pathImageUri), null, null, null, null);
                        cursor.moveToFirst();
                        columnIndex = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        break;
                }
                i = new Intent(v.getContext(), ModelActivity.class);
                i.putExtra("picturePath", picturePath);
                i.putExtra("accountUID", accountUID);
                i.putExtra("appointmentUID", appointmentUID);
                startActivity(i);
            } else {
                Toast.makeText(v.getContext(), "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Toast.makeText(v.getContext(), "Something went wrong", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(2);
                    return true;
                }
                return false;
            }
        });
    }
}
