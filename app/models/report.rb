class Report < ActiveRecord::Base
  
  belongs_to :organization
  
  def increase_views
    update_attributes(views: views + 1)
  end
  
  def increase_downloads
    update_attributes(views: views + 1)
  end
  
end