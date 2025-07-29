defmodule DevteamAiWeb.CoreComponents do
  @moduledoc """
  Provides core UI components.
  """
  use Phoenix.Component

  @doc """
  Renders a live title that can be updated by LiveView.
  """
  def live_title(assigns) do
    ~H"""
    <title><%= render_slot(@inner_block) %><%= if assigns[:suffix], do: assigns.suffix %></title>
    """
  end
end