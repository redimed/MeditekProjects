package com.redimed.telehealth.patient.information.presenter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.text.LoginFilter;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.information.view.IInfoView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utlis.UploadFile;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/14/2016.
 */
public class InfoPresenter implements IInfoPresenter {

    private Gson gson;
    private String pathSign;
    private Context context;
    private Patient[] patients;
    private IInfoView iInfoView;
    private RegisterApi restClient;
    private IMainPresenter iMainPresenter;
    private static final int MEDIA_TYPE_IMAGE = 1;
    private SharedPreferences patientSharedPreferences;
    private String TAG = "INFORMATION_PRESENTER", home, email, address, suburb, postCode, country;

    public InfoPresenter(IInfoView iInfoView, Context context, FragmentActivity activity) {
        this.context = context;
        this.iInfoView = iInfoView;

        gson = new Gson();
        iInfoView.onLoadToolbar();
        restClient = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
        patientSharedPreferences = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getInfoPatient(String uid) {
        restClient.getDetailsPatient(uid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    patients = gson.fromJson(jsonObject.get("data").toString(), Patient[].class);
                    iInfoView.displayInfo(patients);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iInfoView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void loadAvatar(String url) {
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("SystemType", "ARD")
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Cookie", patientSharedPreferences.getString("cookie", ""))
                .addHeader("DeviceID", patientSharedPreferences.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + patientSharedPreferences.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iInfoView.onLoadAvatar(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_error_image);
                        iInfoView.onLoadAvatar(errorBitmap);
                    }
                });
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null){
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void changeViewUpdate(ArrayList<EditText> arrEditText) {
        for (EditText editText : arrEditText){
            editText.setEnabled(true);
        }
    }

    @Override
    public void updateProfile(ArrayList<EditText> arrEditText) {
        for (EditText editText : arrEditText){
            switch (editText.getId()) {
                case R.id.txtHomePhone:
                    home = editText.getText().toString();
                    break;
                case R.id.txtAddress:
                    address = editText.getText().toString();
                    break;
                case R.id.txtSuburb:
                    suburb = editText.getText().toString();
                    break;
                case R.id.txtPostCode:
                    postCode = editText.getText().toString();
                    break;
                case R.id.txtCountry:
                    country = editText.getText().toString();
                    break;
                case R.id.txtEmail:
                    email = editText.getText().toString();
                    break;
            }
        }

        if (isValidateForm(arrEditText)){
            Patient patient = new Patient();
            patient.setEmail(email);
            patient.setSuburb(suburb);
            patient.setAddress1(address);
            patient.setPostCode(postCode);
            patient.setCountryName(country);
            patient.setHomePhoneNumber(home);
            patient.setUID(patientSharedPreferences.getString("patientUID", ""));

            JsonObject jPatient = new JsonObject();
            jPatient.addProperty("data", gson.toJson(patient));

            restClient.updateProfile(jPatient, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {

                }

                @Override
                public void failure(RetrofitError error) {
                    iInfoView.onLoadError(error.getLocalizedMessage());
                }
            });
        }
    }

    public boolean isRequiredData(EditText editText) {
        boolean isRequire = false;
        if (editText.getText().length() == 0) {
            isRequire = true;
        }
        return isRequire;
    }

    private boolean isValidateForm(ArrayList<EditText> arr) {
        boolean isValid = true;
        // Validation Edit Text
        for (EditText editText : arr) {
            if (isRequiredData(editText)){
                iInfoView.onResultField(editText);
                isValid = false;
            }
            if (editText.getId() == R.id.txtEmail) {
                if (!isEmailValid(editText)) {
                    iInfoView.onResultEmail(isEmailValid(editText));
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    // Validate email
    public boolean isEmailValid(EditText editText) {
        boolean isValid = false;
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = editText.getText();
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    @Override
    public void hideKeyboardFragment(View view) {
        //Set up touch listener for non-text box views to hide keyboard.
        if (!(view instanceof EditText)) {
            view.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    InputMethodManager inputMethodManager = (InputMethodManager)
                            context.getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(((Activity) context).getCurrentFocus().getWindowToken(), 0);
                    return false;
                }
            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                hideKeyboardFragment(innerView);
            }
        }
    }

    @Override
    public void downloadSignature(String url) {
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("SystemType", "ARD")
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Cookie", patientSharedPreferences.getString("cookie", ""))
                .addHeader("DeviceID", patientSharedPreferences.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + patientSharedPreferences.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iInfoView.onResultSignature(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_error_image);
                        iInfoView.onResultSignature(errorBitmap);
                    }
                });
    }

    @Override
    public void saveBitmapSign(SignaturePad signaturePad) {
        Bitmap signatureBitmap = signaturePad.getSignatureBitmap();
        if (addSignatureToGallery(signatureBitmap)) {
            iInfoView.onLoadSignature(signatureBitmap, pathSign);
        }
    }

    public File getAlbumStorageDir(String albumName) {
        // Get the directory for the user's public pictures directory.
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), albumName);
        if (!file.mkdirs()) {
            Log.d("SignaturePad", "Directory not created");
        }
        return file;
    }

    public void saveBitmapToJPG(Bitmap bitmap, File photo) throws IOException {
        Bitmap newBitmap = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(newBitmap);
        canvas.drawColor(Color.WHITE);
        canvas.drawBitmap(bitmap, 0, 0, null);
        OutputStream stream = new FileOutputStream(photo);
        newBitmap.compress(Bitmap.CompressFormat.JPEG, 80, stream);
        stream.close();
    }

    private boolean addSignatureToGallery(Bitmap signature) {
        boolean result = false;
        try {
            File photo = new File(getAlbumStorageDir("SignaturePad"), String.format("Signature_%d.jpg", System.currentTimeMillis()));
            pathSign = photo.getPath();
            saveBitmapToJPG(signature, photo);
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            Uri contentUri = Uri.fromFile(photo);
            mediaScanIntent.setData(contentUri);
            context.sendBroadcast(mediaScanIntent);
            result = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public Uri getOutputMediaFileUri(int type) {
        return Uri.fromFile(getOutputMediaFile(type));
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
}
