class Organization < ActiveRecord::Base
  
  before_save :format_subdomain if Rails.env.production?
  before_save :format_string if Rails.env.production?
  
  has_many :nodes, dependent: :delete_all
  has_many :users
  has_many :awsdocuments
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  validates_exclusion_of :subdomain, :in => ["api", "www", "sandbox"]
  
  def format_subdomain
    if url.include? 'www'
      self.subdomain = url.split('/')[2].split('.').first
    else
      self.subdomain = url.split('.')[1]
    end
  end
  
end