package patient.telehealth.redimed.workinjury.utils;

import android.os.AsyncTask;
import android.util.Log;
import com.google.gson.JsonObject;

import org.jdeferred.Deferred;
import org.jdeferred.Promise;
import org.jdeferred.impl.DeferredObject;

import java.io.File;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.mime.TypedFile;

/**
 * Created by MeditekPro on 7/1/16.
 */
public class UploadFileRequest extends AsyncTask<String, String, Promise> {

    private String pathImage;
    private String userUid;
    private String fileType;
    private static final String TAG = "=====UPLOAD=====";

    public UploadFileRequest(String path, String fileType, String userUid) {
        this.pathImage = path;
        this.fileType = fileType;
        this.userUid = userUid;
    }

    @Override
    protected final Promise doInBackground(String... params) {
        try {
            final Deferred deferred = new DeferredObject();
//            final FileUploadsBean file = new FileUploadsBean();
            TypedFile typedFile = new TypedFile("multipart/form-data", new File(pathImage));

            RESTClient.getCoreApi().uploadFile(userUid, fileType, typedFile, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, retrofit.client.Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        deferred.resolve(jsonObject);
                    } else{
                        deferred.reject(Key.error);
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    deferred.reject(error.getMessage());
                }
            });
            return deferred.promise();
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
            return null;
        }
    }
}
