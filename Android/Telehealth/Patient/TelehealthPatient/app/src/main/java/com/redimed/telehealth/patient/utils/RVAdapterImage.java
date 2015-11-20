package com.redimed.telehealth.patient.utils;

import android.content.SharedPreferences;
import android.net.Uri;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.redimed.telehealth.patient.R;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.UrlConnectionDownloader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;

public class RVAdapterImage extends RecyclerView.Adapter<RVAdapterImage.ImageListViewHolder> {

    private List<String> fileUploads;
    private View view;
    private SharedPreferences telehealthPatient;

    public void swapData(List<String> data, SharedPreferences tele) {
        telehealthPatient = tele;
        fileUploads.clear();
        fileUploads.addAll(data);
        notifyDataSetChanged();
    }

    public RVAdapterImage() {
        this.fileUploads = new ArrayList<String>();
    }

    @Override
    public ImageListViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_image_appointment, parent, false);
        ImageListViewHolder imageListViewHolder = new ImageListViewHolder(view);
        return imageListViewHolder;
    }

    @Override
    public void onBindViewHolder(final ImageListViewHolder holder, final int position) {
        Picasso picasso = new Picasso.Builder(view.getContext())
                .downloader(new UrlConnectionDownloader(view.getContext()) {
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
                        holder.imgContains.setVisibility(ImageView.GONE);
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.load(fileUploads.get(position))
                .memoryPolicy(MemoryPolicy.NO_CACHE)
                .networkPolicy(NetworkPolicy.NO_CACHE)
                .error(R.drawable.error_image_icon)
                .fit().centerInside().into(holder.imgContains);
    }

    @Override
    public int getItemCount() {
        return fileUploads.size();
    }

    public static class ImageListViewHolder extends RecyclerView.ViewHolder {
        ImageView imgContains;
        RecyclerView rvImageAppointment;
        CardView cardViewImageApp;

        public ImageListViewHolder(View itemView) {
            super(itemView);
            imgContains = (ImageView) itemView.findViewById(R.id.imgContains);
            rvImageAppointment = (RecyclerView) itemView.findViewById(R.id.rvImageAppointment);
            cardViewImageApp = (CardView) itemView.findViewById(R.id.cardViewImageApp);
        }
    }
}
