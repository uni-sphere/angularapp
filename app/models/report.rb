class Report < ActiveRecord::Base
  
  belongs_to :node
  
  def increase_downloads
    update_attributes(downloads: downloads + 1)
  end
  
end