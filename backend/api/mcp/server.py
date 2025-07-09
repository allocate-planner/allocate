from fastmcp import FastMCP

mcp = FastMCP(name="integrations-mcp")


@mcp.tool()
def search_notion_pages(query: str) -> str:
    return f"Found pages for: {query}"


@mcp.tool()
def get_notion_page(page_id: str) -> str:
    return f"Page content for: {page_id}"
