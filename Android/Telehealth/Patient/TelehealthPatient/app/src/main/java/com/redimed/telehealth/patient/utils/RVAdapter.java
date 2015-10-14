package com.redimed.telehealth.patient.utils;

import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.Category;

import java.util.List;

/**
 * Created by Lam on 10/7/2015.
 */
public class RVAdapter extends RecyclerView.Adapter<RVAdapter.CategoriesViewHolder> {

    private List<Category> categories;
    public RVAdapter(List<Category> arrCategories){
        categories = arrCategories;
    }

    @Override
    public CategoriesViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_drawer_menu, parent, false);
        CategoriesViewHolder categoriesViewHolder = new CategoriesViewHolder(view);
        return categoriesViewHolder;
    }

    @Override
    public void onBindViewHolder(CategoriesViewHolder holder, final int position) {
        holder.imgTitle.setImageResource(categories.get(position).getScrImg());
        holder.lblTitle.setText(categories.get(position).getTitle());
        holder.imgIcon.setImageResource(categories.get(position).getIcon());
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }

    public static class CategoriesViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        CardView cardView;
        ImageView imgTitle;
        TextView lblTitle;
        ImageView imgIcon;

        public CategoriesViewHolder(View itemView) {
            super(itemView);
            cardView = (CardView) itemView.findViewById(R.id.cardViewCategory);
            imgTitle = (ImageView) itemView.findViewById(R.id.imgTitle);
            lblTitle = (TextView) itemView.findViewById(R.id.lblTitle);
            imgIcon = (ImageView) itemView.findViewById(R.id.imgIcon);
            itemView.setClickable(true);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            ((MainActivity)v.getContext()).Display(getAdapterPosition());
        }
    }
}
