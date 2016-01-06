package com.redimed.telehealth.patient.utils;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.android.volley.AuthFailureError;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.ImageLoader;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.NetworkImageView;
import com.android.volley.toolbox.Volley;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.squareup.okhttp.Headers;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.picasso.Callback;
import com.squareup.picasso.LruCache;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.UrlConnectionDownloader;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;

public class RVAdapterImage extends RecyclerView.Adapter<RVAdapterImage.ImageListViewHolder> {

    private final Context context;
    private List<String> fileUploads;
    private RequestQueue requestQueue;
    private final LayoutInflater inflater;
    private SharedPreferences telehealthPatient;

    public RVAdapterImage(Context context, List<String> fileUploads, SharedPreferences tele) {
        this.context = context;
        telehealthPatient = tele;
        this.fileUploads = fileUploads;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public ImageListViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_image_appointment, parent, false);
        return new ImageListViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ImageListViewHolder holder, final int position) {
        holder.progressBar.setVisibility(View.VISIBLE);

        Picasso picasso = new Picasso.Builder(context)
                .downloader(new UrlConnectionDownloader(context) {
                    @Override
                    protected HttpURLConnection openConnection(Uri uri) throws IOException {
                        HttpURLConnection connection = super.openConnection(uri);
                        connection.addRequestProperty("Authorization", "Bearer " + telehealthPatient.getString("token", null));
                        connection.addRequestProperty("DeviceID", telehealthPatient.getString("deviceID", null));
                        connection.addRequestProperty("SystemType", "ARD");
                        connection.addRequestProperty("Cookie", telehealthPatient.getString("cookie", null));
                        connection.addRequestProperty("AppID", "com.redimed.telehealth.patient");
                        return connection;
                    }
                })
                .listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        holder.progressBar.setVisibility(View.GONE);
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                })
                .memoryCache(new LruCache(24000))
                .build();

        picasso.load(fileUploads.get(position))
                .error(R.drawable.icon_error_image)
                .fit().centerInside()
                .into(holder.imgContains, new Callback() {
                    @Override
                    public void onSuccess() {
                        if (holder.progressBar != null) {
                            holder.progressBar.setVisibility(View.GONE);
                        }
                    }

                    @Override
                    public void onError() {
                        if (holder.progressBar != null) {
                            holder.progressBar.setVisibility(View.GONE);
                        }
                    }
                });

//        requestQueue = VolleySingleton.getInstance(context).getRequestQueue();
//        HighPriorityRequest jsonObjectRequest = new HighPriorityRequest(Request.Method.GET, fileUploads.get(position), null,
//                new Response.Listener<JSONObject>() {
//                    @Override
//                    public void onResponse(JSONObject response) {
//                        Log.d("ADAPTER", response.toString());
//                        holder.progressBar.setVisibility(View.GONE);
//                    }
//                }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                VolleyLog.d("ADAPTER", "Error: " + error.getMessage());
//            }
//        }, telehealthPatient);
//        requestQueue.add(jsonObjectRequest);
//
//        ImageLoader imageLoader = VolleySingleton.getInstance(context).getImageLoader();
//        imageLoader.get(fileUploads.get(position), new ImageLoader.ImageListener() {
//            @Override
//            public void onResponse(ImageLoader.ImageContainer response, boolean isImmediate) {
//                if (response.getBitmap() != null) {
//                    holder.networkImageView.setImageBitmap(response.getBitmap());
//                }
//            }
//
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                Log.d("Adapter", error.getLocalizedMessage() + " ");
//            }
//        });
    }

    @Override
    public int getItemCount() {
        return fileUploads.size();
    }

    public class ImageListViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.imgContains)
        ImageView imgContains;
        @Bind(R.id.progressBar)
        ProgressBar progressBar;

//        @Bind(R.id.imgContains)
//        NetworkImageView networkImageView;

        public ImageListViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);

            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    DialogViewImage(v.getContext(), getAdapterPosition());
                }
            });
        }
    }

    public void DialogViewImage(Context context, int position) {
        new DialogViewImage(context, fileUploads.get(position)).show();
    }
}
