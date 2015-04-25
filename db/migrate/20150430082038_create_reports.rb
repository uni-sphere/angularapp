class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.integer :views, default: 0
      t.integer :downloads, default: 0
      t.integer :user_id

      t.timestamps
    end
  end
end
