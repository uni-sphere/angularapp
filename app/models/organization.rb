class Organization < ActiveRecord::Base
  
  before_save :format_subdomain if Rails.env.production?
  
  has_many :nodes, dependent: :delete_all
  has_many :users
  has_many :awsdocuments
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  validates_exclusion_of :subdomain, :in => ["api", "www", "sandbox"]
  
  def format_subdomain
    self.subdomain = (ActiveSupport::Inflector.transliterate self.name.delete('_').downcase).gsub(/[^a-z0-9]/i, "")
  end
  
end