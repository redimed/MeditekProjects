package com.redimed.telehealth.patient.information;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Html;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.information.presenter.IInfoPresenter;
import com.redimed.telehealth.patient.information.presenter.InfoPresenter;
import com.redimed.telehealth.patient.information.view.IInfoView;
import com.redimed.telehealth.patient.model.ModelActivity;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.UploadFile;
import com.redimed.telehealth.patient.views.SignaturePad;

import org.w3c.dom.Text;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Fox on 1/14/2016.
 */
public class InformationFragment extends Fragment implements IInfoView, View.OnClickListener {

    private Uri fileUri;
    private Context context;
    private IInfoPresenter iInfoPresenter;
    private String TAG = "INFORMATION", uid;
    private ArrayList<EditText> arrEditText;
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int MEDIA_TYPE_IMAGE = 1;

    @Bind(R.id.progressBarUpload)
    ProgressBar progressBarUpload;

    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;

    /* Information Patient */
    @Bind(R.id.avatarPatient)
    ImageView avatarPatient;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblPhoneNumber)
    TextView lblPhoneNumber;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtHomePhone)
    EditText txtHomePhone;
    @Bind(R.id.txtAddress)
    EditText txtAddress;
    @Bind(R.id.txtSuburb)
    EditText txtSuburb;
    @Bind(R.id.txtPostCode)
    EditText txtPostCode;
    @Bind(R.id.txtCountry)
    EditText txtCountry;

    @Bind(R.id.lblUpdateProfile)
    TextView lblUpdateProfile;

    /* View Flipper */
    @Bind(R.id.vfContainerProfile)
    ViewFlipper vfContainerProfile;

    @Bind(R.id.layoutImg)
    RelativeLayout layoutImg;
    @Bind(R.id.imgSignature)
    ImageView imgSignature;
    @Bind(R.id.lblNoSign)
    TextView lblNoSign;

    @Bind(R.id.layoutSignature)
    LinearLayout layoutSignature;
    @Bind(R.id.signaturePad)
    SignaturePad signaturePad;

    /* Button */
    @Bind(R.id.lblSubmit)
    TextView btnSubmit;
    @Bind(R.id.lblCancel)
    TextView btnCancel;
    @Bind(R.id.lblSave)
    TextView btnSaveSign;
    @Bind(R.id.lblClear)
    TextView btnClear;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    public InformationFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_information, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        iInfoPresenter = new InfoPresenter(this, context, getActivity());
        iInfoPresenter.hideKeyboardFragment(v);

        initVariable();
        SwipeRefresh();
        initSignature();

        lblNoSign.setOnClickListener(this);
        btnSubmit.setOnClickListener(this);
        btnCancel.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnSaveSign.setOnClickListener(this);
        avatarPatient.setOnClickListener(this);
        lblUpdateProfile.setOnClickListener(this);

        return v;
    }

    private void initSignature() {
        signaturePad.setOnSignedListener(new SignaturePad.OnSignedListener() {
            @Override
            public void onStartSigning() {
                Toast.makeText(context, "OnStartSigning", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSigned() {
                btnSaveSign.setEnabled(true);
            }

            @Override
            public void onClear() {
                btnSaveSign.setEnabled(false);
            }
        });
    }

    private void initVariable() {

        Bundle bundle = getArguments();
        if (bundle != null) {
            uid = bundle.getString("telehealthUID", "");
            iInfoPresenter.getInfoPatient(uid);
        }

        //init array EditText
        arrEditText = new ArrayList<EditText>();
        arrEditText.add(txtHomePhone);
        arrEditText.add(txtAddress);
        arrEditText.add(txtSuburb);
        arrEditText.add(txtPostCode);
        arrEditText.add(txtCountry);
        arrEditText.add(txtEmail);
    }

    //Refresh information patient
    private void SwipeRefresh() {
        final Fragment fragment = this;
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.detach(fragment).attach(fragment).commit();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        scrollViewInfo.post(new Runnable() {
            @Override
            public void run() {
                scrollViewInfo.fullScroll(ScrollView.FOCUS_UP);
                scrollViewInfo.scrollTo(0, 0);
            }
        });

        scrollViewInfo.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                int scrollY = scrollViewInfo.getScrollY();
                if (scrollY == 0) {
                    swipeInfo.setEnabled(true);
                } else swipeInfo.setEnabled(false);
            }
        });
    }

    //Show information Patient
    @Override
    public void displayInfo(Patient[] patients) {
        if (patients != null) {
            String firstName, lastName;
            for (Patient patient : patients) {
                firstName = patient.getFirstName() == null ? "NONE" : patient.getFirstName();
                lastName = patient.getLastName() == null ? "" : patient.getLastName();
                lblNamePatient.setText(firstName + " " + lastName);
                lblPhoneNumber.setText(patient.getPhoneNumber());
                txtHomePhone.setText(patient.getHomePhoneNumber() == null ? "NONE" : patient.getHomePhoneNumber());
                txtEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                txtAddress.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                txtSuburb.setText(patient.getSuburb() == null ? "NONE" : patient.getSuburb());
                txtPostCode.setText(patient.getPostCode() == null ? "NONE" : patient.getPostCode());
                txtCountry.setText(patient.getCountryName() == null ? "NONE" : patient.getCountryName());

                //Call presenter load avatar
                iInfoPresenter.loadAvatar(Config.apiURLDownload + patient.getProfileImage());

                //On Load Signature
                if (patient.getSignature() == null) {
                    String str = "No Signature to show <u><i>click here</i></u> to generate";
                    lblNoSign.setText(Html.fromHtml(str));
                    lblNoSign.setVisibility(View.VISIBLE);
                }
            }
        }
        swipeInfo.setRefreshing(false);
    }

    //Load image avatar
    @Override
    public void onLoadAvatar(Bitmap bitmap) {
        if (bitmap != null) {
            avatarPatient.setImageBitmap(bitmap);
        }
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.profile_title));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iInfoPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onResultField(EditText editText) {
        if (editText != null) {
            editText.requestFocus(); // Scrolls view to this field.
            editText.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onResultEmail(boolean email) {
        if (!email) {
            txtEmail.setText("");
            txtEmail.requestFocus();
            txtEmail.setError(getResources().getString(R.string.email_valid));
        }
    }

    @Override
    public void onLoadSignature(Bitmap bitmap) {
        if (bitmap != null) {
            lblNoSign.setVisibility(View.VISIBLE);
            imgSignature.setImageBitmap(bitmap);
            vfContainerProfile.setDisplayedChild(vfContainerProfile.indexOfChild(layoutImg));
        }
    }

    @Override
    public void onResultUpload(String msg) {

    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
        swipeInfo.setRefreshing(false);
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iInfoPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblUpdateProfile:
                vfContainerProfile.setDisplayedChild(vfContainerProfile.indexOfChild(layoutSignature));
                iInfoPresenter.changeViewUpdate(arrEditText);
                break;
            case R.id.lblSubmit:
                iInfoPresenter.updateProfile(arrEditText);
                break;
            case R.id.lblClear:
                vfContainerProfile.setDisplayedChild(vfContainerProfile.indexOfChild(layoutImg));
                signaturePad.clear();
                break;
            case R.id.lblSave:
                iInfoPresenter.saveBitmapSign(signaturePad);
                break;
            case R.id.lblNoSign:
                vfContainerProfile.setDisplayedChild(vfContainerProfile.indexOfChild(layoutSignature));
                break;
            case R.id.avatarPatient:
                DialogUploadImage();
                break;
        }
    }

    //Display dialog choose camera or gallery to upload image
    private void DialogUploadImage() {
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
                fileUri = iInfoPresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Cursor cursor;
        int columnIndex;
        String picturePath = "";
        try {
            getActivity();
            if (resultCode == Activity.RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
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
                        break;

                    case RESULT_CAMERA:
                        // Downsizing image as it throws OutOfMemory Exception for larger images
                        picturePath = fileUri.getPath();
                        break;

                }
                new UploadFile(context, progressBarUpload, "ProfileImage", picturePath).execute();
            } else {
                Toast.makeText(context, "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
    }
}
